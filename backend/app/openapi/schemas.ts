import { TASK_STATUSES } from '#models/task'
import { ApiProperty, ApiPropertyOptional } from '@foadonis/openapi/decorators'

/**
 * Esquemas del documento OpenAPI de la capability `tasks`.
 *
 * Cada clase se publica una sola vez en `components.schemas` con su nombre, y
 * las operaciones la referencian por `$ref`. Las clases no se instancian nunca:
 * existen solo para que los decoradores describan la forma de lo que el código
 * ya devuelve. Si un transformer cambia, su clase de aquí cambia con él.
 *
 * Están declaradas en orden de dependencia: una clase solo puede referenciar a
 * las que tiene encima.
 */

/**
 * El responsable tal y como sale de `TaskAssigneeTransformer`: nombre e
 * iniciales, y deliberadamente nada más.
 */
export class TaskAssignee {
  @ApiProperty({ type: 'integer' })
  id!: number

  @ApiProperty({
    type: 'string',
    nullable: true,
    description: 'Nulo si la cuenta se registró sin nombre.',
  })
  fullName!: string | null

  @ApiProperty({ type: 'string', description: 'Llegan siempre, aunque no haya nombre.' })
  initials!: string
}

/**
 * Una tarea tal y como sale de `TaskTransformer`: la de la lista, la de crear y
 * la de cambiar el estado. No lleva vencimiento a propósito.
 */
export class Task {
  @ApiProperty({ type: 'integer' })
  id!: number

  @ApiProperty({ type: 'string', maxLength: 200 })
  title!: string

  @ApiProperty({ enum: [...TASK_STATUSES] })
  status!: string

  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt!: string

  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  updatedAt!: string | null

  @ApiProperty({ type: TaskAssignee })
  assignee!: TaskAssignee
}

/**
 * Una tarea tal y como sale de `TaskDetailTransformer`: la de la consulta suelta
 * y la de fijar la fecha. Es la única que trae la fecha y la condición de
 * vencida, resuelta contra el `today` de la petición.
 */
export class TaskDetail {
  @ApiProperty({ type: 'integer' })
  id!: number

  @ApiProperty({ type: 'string', maxLength: 200 })
  title!: string

  @ApiProperty({ enum: [...TASK_STATUSES] })
  status!: string

  @ApiProperty({
    type: 'string',
    format: 'date',
    nullable: true,
    description: 'Día del calendario (AAAA-MM-DD), sin hora. Nulo si la tarea no tiene fecha.',
  })
  dueDate!: string | null

  @ApiProperty({
    type: 'boolean',
    description:
      'Tiene fecha, esa fecha es anterior al `today` de la petición y la tarea no está en `done`.',
  })
  isOverdue!: boolean

  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt!: string

  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  updatedAt!: string | null

  @ApiProperty({ type: TaskAssignee })
  assignee!: TaskAssignee
}

/**
 * Los envoltorios `{ data }` que pone `serialize()` en toda respuesta correcta.
 */
export class TaskEnvelope {
  @ApiProperty({ type: Task })
  data!: Task
}

export class TaskListEnvelope {
  @ApiProperty({ type: [Task], description: 'La lista entera, sin paginar.' })
  data!: Task[]
}

export class TaskDetailEnvelope {
  @ApiProperty({ type: TaskDetail })
  data!: TaskDetail
}

/**
 * Un error de VineJS sobre un campo concreto.
 */
export class ValidationErrorItem {
  @ApiProperty({ type: 'string' })
  message!: string

  @ApiProperty({
    type: 'string',
    description: 'La regla que ha fallado, p. ej. `required` o `enum`.',
  })
  rule!: string

  @ApiProperty({ type: 'string', description: 'El campo señalado.' })
  field!: string

  @ApiPropertyOptional({
    type: 'object',
    description: 'Datos de la regla; en `enum`, las opciones admitidas en `choices`.',
  })
  meta?: Record<string, unknown>
}

export class ValidationError {
  @ApiProperty({ type: [ValidationErrorItem] })
  errors!: ValidationErrorItem[]
}

/**
 * Un error sin campo: solo el mensaje. Es el cuerpo de un `404` y cada elemento
 * de un `401`.
 */
export class ErrorMessage {
  @ApiProperty({ type: 'string' })
  message!: string
}

export class UnauthorizedError {
  @ApiProperty({ type: [ErrorMessage] })
  errors!: ErrorMessage[]
}

/**
 * Cuerpos de petición, uno por validador.
 */
export class CreateTaskBody {
  @ApiProperty({
    type: 'string',
    minLength: 1,
    maxLength: 200,
    description:
      'Se recortan los espacios de los extremos antes de validar: uno de solo espacios cuenta como vacío. Cualquier otro campo del cuerpo se ignora.',
  })
  title!: string
}

export class UpdateTaskStatusBody {
  @ApiProperty({ enum: [...TASK_STATUSES] })
  status!: string
}

export class SetTaskDueDateBody {
  @ApiProperty({
    type: 'string',
    format: 'date',
    nullable: true,
    description: 'Día del calendario (AAAA-MM-DD). `null` retira la fecha.',
  })
  dueDate!: string | null

  @ApiProperty({
    type: 'string',
    format: 'date',
    description:
      'Día de referencia de quien hace la petición, para resolver `isOverdue` en la respuesta.',
  })
  today!: string
}
