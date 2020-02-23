import { interval, of, queueScheduler, defer, timer, SchedulerLike, fromEvent } from 'rxjs';
import { delay, switchMap, tap, flatMap, map, repeat, delayWhen, concatMap, take, debounceTime } from 'rxjs/operators';

// v^v delay
export const createSpecialInterval = (number: number, scheduler ?: SchedulerLike ) => {
  return interval(0, scheduler).pipe(concatMap(v => of(v).pipe(delay(v * 1000, scheduler))), take(number));
}

createSpecialInterval(100).subscribe(v => {
  console.log(v);
  // console.timeEnd('interval');
  // console.time('interval');
});

const myInput = document.querySelector('input');

// const p = new Promise((resolve) => {
//   myInput.addEventListener('input', (event) => {
//     resolve(event);
//   });
// });

// p.then((event: KeyboardEvent) => console.log((event.target as HTMLInputElement).value));

// function createEventPromise() {
//   let listener: (event: KeyboardEvent) => void;
//   const p = new Promise((resolve) => {
//     listener = (event) => {
//       resolve(event);
//     }
//     myInput.addEventListener('input', listener);
//   });

//   p.then((event: KeyboardEvent) => {
//     console.log((event.target as HTMLInputElement).value);
//     fetch(`https://api.github.com/search/repositories?q=${(event.target as HTMLInputElement).value}`)
//     .then(response => response.json())
//     .then((response) => {
//       console.log('Repositories count: ', response.total_count);
//     });
//     myInput.removeEventListener('input', listener);
//     createEventPromise();
//   });
// }
// createEventPromise();

const observable = fromEvent(myInput, 'input');
observable.pipe(
  debounceTime(500),
  switchMap((event: KeyboardEvent) => {
    return fetch(`https://api.github.com/search/repositories?q=${(event.target as HTMLInputElement).value}`)
           .then((response => response.json()));
  })
).subscribe((response: any) => console.log('Repositories count: ', response.total_count));