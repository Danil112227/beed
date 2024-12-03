import datetime


def _convert_str_to_time(time_str):
    return datetime.datetime.strptime(time_str, '%H:%M').time()
