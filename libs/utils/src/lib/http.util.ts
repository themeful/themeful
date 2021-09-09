import { Observable, timer } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import { mergeMap, takeUntil } from 'rxjs/operators'

const timeout = 5e3

function _get<T>(url: string): Observable<T> {
  return fromFetch(url).pipe(
    mergeMap((response) => response.json()),
    takeUntil(timer(timeout))
  )
}

function _post<T, U>(url: string, data: U): Observable<T> {
  return fromFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }).pipe(
    mergeMap((response) => response.json()),
    takeUntil(timer(timeout))
  )
}

function _patch<T, U>(url: string, data: U): Observable<T> {
  return fromFetch(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }).pipe(
    mergeMap((response) => response.json()),
    takeUntil(timer(timeout))
  )
}

function _delete<T>(url: string): Observable<T> {
  return fromFetch(url, {
    method: 'DELETE',
  }).pipe(
    mergeMap((response) => response.json()),
    takeUntil(timer(timeout))
  )
}

export const http = {
  get: _get,
  post: _post,
  patch: _patch,
  delete: _delete,
}
