class ApiException(Exception):
    def __init__(self, erroCode: int = 500, message: str = 'Fatal Error Has Occured') -> None:
        self.errorCode = erroCode
        self.message = message
        super()

    def __str__(self):
        return f'Code: {self.errorCode}\nError: {self.message}'
