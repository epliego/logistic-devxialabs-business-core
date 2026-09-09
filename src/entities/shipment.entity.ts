import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { InternalUserEntity } from './internal-user.entity';
import { ValuesCatalogEntity } from './values-catalog.entity';

@Entity('public.shipment')
export class ShipmentEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Unique Identifier',
  })
  id: number;

  @Column({
    type: 'character varying',
    length: 255,
    comment: 'Guide code (Tracking)',
  })
  guide_code: string;

  @Column({
    type: 'character varying',
    length: 255,
    comment: 'Provenance direction',
  })
  provenance_direction: string;

  @Column({
    type: 'character varying',
    length: 255,
    comment: 'Destination direction',
  })
  destination_direction: string;

  @Column({
    type: 'character varying',
    length: 255,
    comment: 'Recipient name',
  })
  recipient_name: string;

  @Column({
    type: 'character varying',
    length: 255,
    comment: 'Recipient phone',
    nullable: true,
  })
  recipient_phone: string | null;

  @Column({
    type: 'numeric',
    comment: 'Weight (Kg)',
  })
  weight_kg: number;

  @OneToOne(() => ValuesCatalogEntity)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status: Promise<ValuesCatalogEntity>;

  @Column({
    type: 'int',
    comment: 'Active record boolean attribute',
    default: 0,
  })
  active: number;

  @Column({
    type: 'timestamp with time zone',
    comment: 'Insert Date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  insert_date: Date;

  @OneToOne(() => InternalUserEntity)
  @JoinColumn({ name: 'insert_by_internal', referencedColumnName: 'id' })
  insert_by_internal: Promise<InternalUserEntity>;

  @Column({
    type: 'timestamp with time zone',
    comment: 'Update Date',
    nullable: true,
  })
  update_date: Date;

  @OneToOne(() => InternalUserEntity)
  @JoinColumn({ name: 'insert_by_internal', referencedColumnName: 'id' })
  update_by_internal: Promise<InternalUserEntity>;
}
