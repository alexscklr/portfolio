export type DataSource = 'api' | 'frontend-mock';

export interface Environment {
    dataSource: DataSource;
    apiUrl: string;
}