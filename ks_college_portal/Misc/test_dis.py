from geopy.distance import geodesic

COLLEGE_LOCATION = (23.036464, 72.548065)
MAX_ALLOWED_DISTANCE_METERS = 34

ff = '23.036355,72.547900'
user_lat = ff.split(',')[0]
user_lon = ff.split(',')[-1]

user_location = (user_lat, user_lon)
distance = geodesic(COLLEGE_LOCATION, user_location).meters
print(distance)


