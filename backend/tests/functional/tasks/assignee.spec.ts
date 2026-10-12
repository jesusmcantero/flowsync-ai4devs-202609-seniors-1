import type { Assert } from '@japa/assert'
import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`.
 *
 * El scenario habla de «cualquier tarea, suelta o dentro de la lista», así que
 * cada test mira las tres formas en que el cliente recibe una tarea: la lista,
 * la tarea suelta y la respuesta de crearla. Son transformers distintos, y que
 * uno cumpla no dice nada de los otros.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function sesion(client: any, email = 'quien-mira@example.com') {
    await User.create({ fullName: 'Quien Mira', email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return response.body().data.token as string
  }

  /**
   * Las dos lecturas de una tarea ya existente, tal y como le llegan al
   * cliente: dentro de la lista y suelta. La de creación se pide aparte porque
   * su responsable es quien la envía, no uno elegido.
   */
  async function lecturas(client: any, assert: Assert, token: string, task: Task) {
    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)
    lista.assertStatus(200)

    const suelta = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: '2026-10-12' })
      .header('Authorization', `Bearer ${token}`)
    suelta.assertStatus(200)

    const enLista = lista.body().data.find((t: any) => t.id === task.id)
    assert.isObject(enLista, 'la tarea no aparece en la lista')
    assert.isObject(enLista.assignee, 'la tarea de la lista no trae assignee')
    assert.isObject(suelta.body().data.assignee, 'la tarea suelta no trae assignee')

    return { lista: enLista.assignee, suelta: suelta.body().data.assignee }
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const token = await sesion(client)
    const ada = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: ada.id,
    })

    const { lista, suelta } = await lecturas(client, assert, token, task)

    for (const assignee of [lista, suelta]) {
      assert.equal(assignee.fullName, 'Ada Lovelace')
      assert.equal(assignee.initials, 'AL')
    }
  })

  test('el responsable no trae el email ni ningún dato de acceso', async ({ client, assert }) => {
    const token = await sesion(client)
    const ada = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: ada.id,
    })

    const { lista, suelta } = await lecturas(client, assert, token, task)

    const creada = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'Otra tarea' })
    creada.assertStatus(201)

    const lecturasPorOrigen = { lista, suelta, creada: (creada.body().data as any).assignee }

    // Lista blanca y no negra: el requisito dice «ningún otro dato», así que
    // cualquier campo de más es una fuga, se llame como se llame. El `id` se
    // admite porque identifica al responsable sin revelar nada de su cuenta.
    const permitidos = ['fullName', 'id', 'initials']

    // Se recogen todas las fugas antes de afirmar nada: si falla, el mensaje
    // dice en qué lecturas se cuela qué campo, no solo la primera.
    const fugas = Object.entries(lecturasPorOrigen).flatMap(([origen, assignee]) => {
      assert.isObject(assignee, `la lectura «${origen}» no trae assignee`)

      const sobrantes = Object.keys(assignee).filter((campo) => !permitidos.includes(campo))
      if (JSON.stringify(assignee).includes('@example.com')) sobrantes.push('(un email)')

      return sobrantes.map((campo) => `${origen}.${campo}`)
    })

    assert.deepEqual(fugas, [], `el assignee expone datos de cuenta: ${fugas.join(', ')}`)
  })

  test('un responsable sin nombre llega con nombre nulo e iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const anonima = await User.create({
      fullName: null,
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: anonima.id,
    })

    const { lista, suelta } = await lecturas(client, assert, token, task)

    for (const assignee of [lista, suelta]) {
      assert.property(assignee, 'fullName')
      assert.isNull(assignee.fullName)
      assert.equal(assignee.initials, 'AE')
    }
  })
})
