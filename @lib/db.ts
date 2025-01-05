import { Country } from './localization'

interface UserPreferences {
  chatId: number
  country: Country
}

class DB {
  private users: UserPreferences[] = []

  setUserCountry(chatId: number, country: Country) {
    const existingUser = this.users.find(u => u.chatId === chatId)
    if (existingUser) {
      existingUser.country = country
    } else {
      this.users.push({ chatId, country })
    }
  }

  getUserCountry(chatId: number): Country | undefined {
    return this.users.find(u => u.chatId === chatId)?.country
  }
}

export const db = new DB()

