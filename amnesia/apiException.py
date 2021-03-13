class ApiException(Exception):
    def __init__(self, erroCode: int = 500, message: str = 'Fatal Error Has Occured') -> None:
        self.errorCode = erroCode
        self.message = message
        super().__init__(str)