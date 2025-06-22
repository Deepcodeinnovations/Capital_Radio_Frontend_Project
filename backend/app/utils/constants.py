import os
def get_static_url():
    current_path = os.path.abspath(__file__)
    
    if 'deepcodegroup.com' in current_path:
        # Production connection string
        return  "https://capitalradio.deepcodegroup.com/"
    else:
        # Local development connection string
        return  "http://127.0.0.1:8000/"



BASE_URL = get_static_url()
SUCCESS = "success"
ERROR = "error"
msg_register = "You have been logged Successfully"