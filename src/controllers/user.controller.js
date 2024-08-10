export class UserController {
  static async createClient (req, res) {
    res.send('createClient')
  }

  static async getUsers (req, res) {
    res.send('getClients')
  }

  static async getUserById (req, res) {
    res.send('getClient')
  }

  static async updateClient (req, res) {
    res.send('updateClient')
  }

  static async deleteClient (req, res) {
    res.send('deleteClient')
  }
}
