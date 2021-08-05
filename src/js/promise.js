class Timeout {
  constructor() {
    this.ids = [];
  }

  set = (delay, reason) =>
    new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        if (reason === undefined) resolve();
        else reject(reason);
        this.clear(id);
      }, delay);
      this.ids.push(id);
    });

  wrap = (promise, delay, reason) =>
    Promise.race([promise, this.set(delay, reason)]);

  clear = (...ids) => {
    this.ids = this.ids.filter(id => {
      if (ids.includes(id)) {
        clearTimeout(id);
        return false;
      }
      return true;
    });
  };
}

const myFunc = async () => {
  const timeout = new Timeout();
  const timeout2 = new Timeout();
  timeout.set(6000).then(() => console.log('Hello'));
  timeout2.set(4000).then(() => console.log('Hi'));
  timeout
    .wrap(fetch('https://cool.api.io/data.json'), 3000, {
      reason: 'Fetch timeout',
    })
    .then(data => {
      console.log(data.message);
    })
    .catch(data => console.log(`Failed with reason: ${data.reason}`))
    .finally(() => timeout.clear(...timeout.ids));
};

export default myFunc