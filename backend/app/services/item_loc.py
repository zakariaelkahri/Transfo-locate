

def get_item_loc(itm_loc_num :str):
    zone = itm_loc_num[0:2] 
    alee = itm_loc_num[2:4] 
    rack = itm_loc_num[4:6] 
    travee = itm_loc_num[6:8] 
    niveau = itm_loc_num[8]
    
    return {
        "zone" : zone,
        "alee" : alee,
        "rack" : rack,
        "travee" : travee,
        "niveau" : niveau
    }
