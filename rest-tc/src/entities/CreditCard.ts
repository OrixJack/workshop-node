import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { CreditCardStatus } from "./CreditCardStatus.js";
import { CardType } from "./CardType.js";

@Index("credit_card_pkey", ["id"], { unique: true })
@Entity("credit_card", { schema: "product" })
export class CreditCard {
  @Column("real", { name: "credit_limit", nullable: true, precision: 24 })
  creditLimit!: number | null;

  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("text", { name: "card_holder_name", nullable: true })
  cardHolderName!: string | null;

  @Column("text", { name: "expiry_date", nullable: true })
  expiryDate!: string;

  @Column("text", { name: "card_number", nullable: true })
  cardNumber!: string;

  @Column("uuid", { name: "client_id", nullable: true })
  clientId!: string;
  
  @Column("integer", { name: "status", nullable: true })
  status: number;

  @Column("integer", { name: "card_type", nullable: true })
  cardType: number;

  @Column("integer", { name: "security_code", nullable: true })
  securityCode: number;

  @ManyToOne(() => CreditCardStatus)
  @JoinColumn({ name: "status" })
  statusData: CreditCardStatus;

  @ManyToOne(() => CardType)
  @JoinColumn({ name: "card_type" })
  cardTypeData: CardType;
}
