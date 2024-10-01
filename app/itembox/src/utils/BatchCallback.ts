export class BatchCallback<T = any> {
  private timeoutId?: any
  private subjects: string[] = []

  // TODO: put some type innit
  private promise?: Promise<T>
  private resolve?: any
  private reject?: any

  constructor(
    public callback: (subjects: string[]) => Promise<T>,
    public delay = 50
  ) {}

  async add(subject: string) {
    if (this.subjects.indexOf(subject) === -1) {
      this.subjects.push(subject)
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    // create a deferred promise if not yet present
    if (!this.promise) {
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    }

    this.timeoutId = setTimeout(() => {
      this.callback([...this.subjects])
        .then(this.resolve)
        .catch(this.reject)
      this.timeoutId = undefined
      this.promise = undefined
      this.subjects = []
    }, this.delay)

    return this.promise
  }
}
