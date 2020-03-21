interface User {
  User_ID: int;
  User_Name: string
}

interface Event {
  Event_ID: int;
  Description: string;
  Photo: string;
  Date: Date;
  Host_ID: int;
  Spot_ID: int;
  Participants_min: int;
  Participants_max: int;
  Sport: string
}

interface EventParticipant {
  Event_ID: int;
  User_ID: int;
}

interface FieldSpot {
  Field: string;
  Spot_ID: int;
}

interface Spot {
  Spot_ID: int;
  Spot_longitude : int;
  Spot_latitude : int;
  Fields : string;
}

module.exports = {
  UserModel: User;
  EventModel: Event;
  SpotModel : Spot;
  FieldSpotModel : FieldSpot;
  EventParticipantModel : EventParticipant;
};
