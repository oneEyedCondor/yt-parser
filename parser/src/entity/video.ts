import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Video {
    @ObjectIdColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: 0 })
    views: number;

    @Column({ default: 0 })
    likes: number;

    @Column({ default: 0 })
    comments: number;

    @Column()
    link: string;
}
