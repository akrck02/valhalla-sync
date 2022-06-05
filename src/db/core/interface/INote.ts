export default interface INote {
    id: number;
    author: string;
    title: string;
    content: string;
}

export class INoteComparer {

    public static equalsById(a: INote, b: INote): boolean {
        return a.id == b.id;
    }

    public static equals(a: INote, b: INote): boolean {

        if(!this.equalsById(a, b))
            return false;

        if(a.author != b.author)
            return false;

        if(a.title != b.title)
            return false;

        if(a.content != b.content)
            return false;

        return true;
    }

}