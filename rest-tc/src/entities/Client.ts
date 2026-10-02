import { Column, Entity, Index } from "typeorm";

@Index("client_email_key", ["email"], { unique: true })
@Index("client_pkey", ["id"], { unique: true })
@Entity("client", { schema: "admin" })
export class Client {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("text", { name: "name" })
  name: string;

  @Column("text", { name: "phone_number" })
  phoneNumber: string;

  @Column("text", { name: "email" })
  email: string;
}
