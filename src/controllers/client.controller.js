export class ClientController {
  static async createClient (req, res) {
    res.send('createClient')
  }

  static async getClients (req, res) {
    res.send('getClients')
  }

  static async getClient (req, res) {
    res.send('getClient')
  }

  static async updateClient (req, res) {
    res.send('updateClient')
  }

  static async deleteClient (req, res) {
    res.send('deleteClient')
  }
}
