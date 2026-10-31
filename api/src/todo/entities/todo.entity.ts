import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', default: 'TODO' })
  status: string;

  @ManyToOne('User', 'todos')
  owner: any;

  @Column({ type: 'uuid', nullable: true })
  ownerId: string;
}
