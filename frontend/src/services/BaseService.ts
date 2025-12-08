export class BaseService<CreateDto, ResponseDto> {
  constructor(private baseUrl: string) {}

  async create(createDto: CreateDto): Promise<ResponseDto> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createDto),
    });

    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  }

  async findAll(): Promise<ResponseDto[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }

  async findOne(id: string): Promise<ResponseDto> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }

  async remove(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
  }

  async update(id: string, updateDto: CreateDto): Promise<ResponseDto> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateDto),
    });

    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  }

   async getCustom<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${endpoint}`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }
}