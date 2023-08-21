import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '@repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  private items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((items) => items.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)
    return user
  }
}
