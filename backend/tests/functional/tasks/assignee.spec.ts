import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre las filas «No cubierto»
 * de `docs/verificacion/jmcd.md` para el requisito «Lo que cada tarea muestra
 * de su responsable» de `openspec/specs/tasks/spec.md`.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const hoy = '2026-10-10'

  async function sesion(client: any, fullName: string | null = 'Ada Lovelace') {
    const user = await User.create({ fullName, email: 'ada@example.com', password: 'secreto123' })

    const response = await client
      .post('/api/v1/auth/login')
      .json({ email: 'ada@example.com', password: 'secreto123' })

    return { user, token: response.body().data.token as string }
  }

  async function tareaDe(user: User) {
    return Task.create({ title: 'Revisar el informe', status: 'pending', assigneeId: user.id })
  }

  test('una tarea muestra el nombre y las iniciales de su responsable', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client)
    const tarea = await tareaDe(user)

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const responsable = response.body().data.assignee
    assert.equal(responsable.fullName, 'Ada Lovelace')
    assert.equal(responsable.initials, 'AL')
  })

  test('la tarea suelta no muestra el email ni datos de acceso del responsable', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client)
    const tarea = await tareaDe(user)

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const responsable = response.body().data.assignee
    assert.notProperty(responsable, 'email')
    assert.notProperty(responsable, 'password')
    assert.notInclude(JSON.stringify(responsable), 'ada@example.com')
  })

  test('la lista no muestra el email ni datos de acceso del responsable', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client)
    await tareaDe(user)

    const response = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const [tarea] = response.body().data
    assert.notProperty(tarea.assignee, 'email')
    assert.notProperty(tarea.assignee, 'password')
    assert.notInclude(JSON.stringify(tarea.assignee), 'ada@example.com')
  })

  test('crear una tarea no devuelve el email del responsable', async ({ client, assert }) => {
    const { token } = await sesion(client)

    const response = await client
      .post('/api/v1/tasks')
      .json({ title: 'Revisar el informe' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(201)
    assert.notProperty(response.body().data.assignee, 'email')
  })

  test('cambiar el estado no devuelve el email del responsable', async ({ client, assert }) => {
    const { user, token } = await sesion(client)
    const tarea = await tareaDe(user)

    const response = await client
      .patch(`/api/v1/tasks/${tarea.id}/status`)
      .json({ status: 'in_progress' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.notProperty(response.body().data.assignee, 'email')
  })

  test('junto al responsable no aparecen las fechas de su cuenta', async ({ client, assert }) => {
    const { user, token } = await sesion(client)
    const tarea = await tareaDe(user)

    const suelta = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)
    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    for (const responsable of [suelta.body().data.assignee, lista.body().data[0].assignee]) {
      assert.notProperty(responsable, 'createdAt')
      assert.notProperty(responsable, 'updatedAt')
    }
  })

  const nombresEnBlanco: Array<[string, string]> = [
    ['un nombre solo de espacios sigue dando iniciales en la tarea', '   '],
    ['un nombre que empieza por espacio sigue dando iniciales en la tarea', ' Ada'],
  ]

  for (const [titulo, fullName] of nombresEnBlanco) {
    test(titulo, async ({ client, assert }) => {
      const { user, token } = await sesion(client, fullName)
      const tarea = await tareaDe(user)

      const response = await client
        .get(`/api/v1/tasks/${tarea.id}`)
        .qs({ today: hoy })
        .header('Authorization', `Bearer ${token}`)

      response.assertStatus(200)
      assert.isNotEmpty(response.body().data.assignee.initials)
    })
  }
})
