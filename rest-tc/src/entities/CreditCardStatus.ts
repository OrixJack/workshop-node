import { Column, Entity, Index } from "typeorm";

@Index("credit_card_status_pkey", ["id"], { unique: true })
@Entity("credit_card_status", { schema: "product" })
export class CreditCardStatus {
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("text", { name: "name", nullable: true })
  name: string | null;
}
