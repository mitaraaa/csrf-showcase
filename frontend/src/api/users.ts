import client from "./client";

class UserService {
  async getMe(): Promise<User> {
    const response = await client.get("/me");

    return response.data;
  }

  async checkRecipient(username: string): Promise<{ exists: boolean }> {
    const response = await client.get("/exists", { params: { username } });

    return response.data;
  }

  async login(username: string, password: string): Promise<User> {
    const response = await client.post("/login", { username, password });

    return response.data;
  }

  async register(username: string, password: string): Promise<User> {
    const response = await client.post("/register", { username, password });

    return response.data;
  }

  async logout(): Promise<void> {
    await client.post("/logout");
  }
}

const userService = new UserService();
export default userService;
