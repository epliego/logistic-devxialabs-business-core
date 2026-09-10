import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { InternalUserEntity } from './internal-user.entity';
import { ShipmentEntity } from './shipment.entity';
import { ValuesCatalogEntity } from './values-catalog.entity';

@Entity('public.shipment_tracking_history')
export class ShipmentTrackingHistoryEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Unique Identifier',
  })
  id: number;

  @OneToOne(() => ShipmentEntity)
  @JoinColumn({ name: 'shipment_id', referencedColumnName: 'id' })
  shipment: Promise<ShipmentEntity>;

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
