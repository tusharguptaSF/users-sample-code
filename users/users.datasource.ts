import { DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { GetUsersModel } from './models/get-users.model';
import { UserslistFacadeService } from "./users-facade.service";
import { catchError, finalize } from "rxjs/operators";


export class UsersDataSource implements DataSource<GetUsersModel> {

    private readonly usersRow = new BehaviorSubject<GetUsersModel[]>([]);
    private readonly loadingUsers = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingUsers.asObservable();
    public rowCount: number;
    constructor(private readonly userService: UserslistFacadeService) { }

    connect(): Observable<GetUsersModel[]> {
        return this.usersRow.asObservable();
    }

    disconnect(): void {
        this.usersRow.complete();
        this.loadingUsers.complete();
    }

    loadUsers(filter: string,
        sortDirection: string,
        pageIndex: number,
        pageSize: number) {

        this.loadingUsers.next(true);

        this.userService.getUsers(pageSize, pageIndex, filter, sortDirection).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingUsers.next(false))
        )
            .subscribe(items => {
                this.rowCount = items['total'];
                return this.usersRow.next(items['data']);
            });
    }
}

