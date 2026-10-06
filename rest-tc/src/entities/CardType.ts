import { Column, Entity, Index } from "typeorm";

@Index("card_type_pkey", ["id"], { unique: true })
@Entity("card_type", { schema: "product" })
export class CardType {
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Column("text", { name: "name", nullable: true })
  name: string | null;
}
