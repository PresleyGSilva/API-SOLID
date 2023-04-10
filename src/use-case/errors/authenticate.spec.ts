import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '@use-case/authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase
describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })
})

it('should be able to authenticate with wrong email', async () => {
  expect(() =>
    sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    }),
  ).rejects.toBeInstanceOf(InvalidCredentialsError)

  it('should be able to authenticate password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '125847',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
