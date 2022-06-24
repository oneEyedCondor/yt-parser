import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Channel {
    @ObjectIdColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: 0 })
    subscribers: number;

    @Column({ default: 0 })
    views: number;

    @Column({ default: 0 })
    likes: number;

    @Column({ default: 0 })
    er: number;
}
