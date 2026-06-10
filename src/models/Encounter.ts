export default interface Encounter {
    id: string;
    name: string;
    enemy_types: string[];
    activity_type: string;
    activity: string;
    expansion: string;
    encounters: number[];
}
