import * as actionTypes from '../actions/actionTypes';
import {createUserSuccess, createUserFailure} from '../actions/createUser';
import {postCreateUser} from '../api';
import { mergeMap, catchError, map} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';

const createUserEpic = (action$) =>
    action$.pipe(ofType(actionTypes.CREATING_USER),
        mergeMap(action =>
            from(postCreateUser()).pipe(
                map(response => createUserSuccess()),
                catchError(error => of(createUserFailure(error)))
            )));

export default createUserEpic;