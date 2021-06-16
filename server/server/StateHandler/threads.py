from threading import Thread


class ResultThread(Thread):
    def __init__(self, func, args=()):
        super(ResultThread, self).__init__()
        self.func = func
        self.args = args

    def run(self):
        self.result = self.func(self.args[0], json=self.args[1] if len(self.args) > 1 else None)

    def get_result(self):
        Thread.join(self)
        try:
            return self.result
        except Exception:
            return None
