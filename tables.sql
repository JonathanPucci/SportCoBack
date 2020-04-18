DROP TABLE Users CASCADE;
DROP TABLE UserStats CASCADE;
DROP TABLE UserPushNotifications CASCADE;
DROP TABLE EventComments CASCADE;
DROP TABLE EventParticipants CASCADE;
DROP TABLE Events CASCADE;
DROP TABLE FieldSpots CASCADE;
DROP TABLE Spots CASCADE;




CREATE TYPE sport AS ENUM ('basket', 'soccer', 'futsal', 'workout', 'running', 'volley', 'beachvolley', 'tennis');
CREATE TYPE sport_level AS ENUM ('first time', 'beginner', 'intermediate', 'advanced', 'pro');
CREATE TYPE visibility AS ENUM ('public','private');


CREATE TABLE Users (
	user_id serial NOT NULL,
	User_Name TEXT NOT NULL,
	Email VARCHAR(255) NOT NULL UNIQUE,
	Photo_url VARCHAR(255),
	user_push_token VARCHAR(255) UNIQUE,
	CONSTRAINT Users_pk PRIMARY KEY (user_id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE UserStats (
	user_id bigint NOT NULL,
	basket_joined bigint DEFAULT 0,
	tennis_joined bigint DEFAULT 0,
	soccer_joined bigint DEFAULT 0,
	futsal_joined bigint DEFAULT 0,
	beachvolley_joined bigint DEFAULT 0,
	volley_joined bigint DEFAULT 0,
	workout_joined bigint DEFAULT 0,
	running_joined bigint DEFAULT 0,	
	basket_created bigint DEFAULT 0,
	tennis_created bigint DEFAULT 0,
	soccer_created bigint DEFAULT 0,
	futsal_created bigint DEFAULT 0,
	beachvolley_created bigint DEFAULT 0,
	volley_created bigint DEFAULT 0,
	workout_created bigint DEFAULT 0,
	running_created bigint DEFAULT 0,	
	basket_level sport_level DEFAULT 'intermediate',
	tennis_level sport_level DEFAULT 'intermediate',
	soccer_level sport_level DEFAULT 'intermediate',
	futsal_level sport_level DEFAULT 'intermediate',
	beachvolley_level sport_level DEFAULT 'intermediate',
	volley_level sport_level DEFAULT 'intermediate',
	workout_level sport_level DEFAULT 'intermediate',
	running_level sport_level DEFAULT 'intermediate',	
	CONSTRAINT user_id PRIMARY KEY (user_id)
) WITH (
  OIDS=FALSE
);

-- Max 15 per user, batch TODO to clean

CREATE TABLE UserPushNotifications (
	user_id bigint NOT NULL,
	date timestamp NOT NULL,
	message_type VARCHAR(255),
	data_type VARCHAR(255),
	data_value VARCHAR(255),
	CONSTRAINT user_id_key_notif PRIMARY KEY (user_id,date)
) WITH (
  OIDS=FALSE
);



CREATE TABLE Events (
	event_id serial NOT NULL,
	Description TEXT,
	Photo TEXT,
	Date timestamp NOT NULL,
	Host_ID bigint NOT NULL,
	Spot_ID bigint NOT NULL,
	Participants_min int NOT NULL,
	Participants_max int NOT NULL,
	Sport sport NOT NULL,
	sport_level sport_level NOT NULL DEFAULT 'intermediate', 
	visibility visibility NOT NULL DEFAULT 'public',
	CONSTRAINT Events_pk PRIMARY KEY (event_id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE EventComments (
	event_id bigint NOT NULL,
	comment_text TEXT NOT NULL,
	date timestamp NOT NULL,
	user_id bigint NOT NULL,
	CONSTRAINT EventComments_pk PRIMARY KEY (event_id,date,user_id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE Spots (
	Spot_ID serial NOT NULL,
	Spot_name TEXT,
	Spot_longitude decimal NOT NULL,
	Spot_latitude decimal NOT NULL,
	CONSTRAINT Spots_pk PRIMARY KEY (Spot_ID)
) WITH (
  OIDS=FALSE
);

CREATE TABLE EventParticipants (
	user_id serial NOT NULL,
	event_id serial NOT NULL,
	UNIQUE (user_id,event_id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE FieldSpots (
	Spot_ID bigint NOT NULL,
	Field TEXT NOT NULL,
	UNIQUE (Spot_ID,Field)
) WITH (
  OIDS=FALSE
);




ALTER TABLE UserStats ADD CONSTRAINT UserStats_fk0 FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;
ALTER TABLE UserPushNotifications ADD CONSTRAINT UserPushNotifications_fk0 FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;
ALTER TABLE Events ADD CONSTRAINT Events_fk0 FOREIGN KEY (Host_ID) REFERENCES Users(user_id) ON DELETE CASCADE;
ALTER TABLE Events ADD CONSTRAINT Events_fk1 FOREIGN KEY (Spot_ID) REFERENCES Spots(Spot_ID) ON DELETE CASCADE;
ALTER TABLE EventComments ADD CONSTRAINT EventComments_fk1 FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;
ALTER TABLE EventComments ADD CONSTRAINT EventComments_fk2 FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE;
ALTER TABLE FieldSpots ADD CONSTRAINT FieldSpots_fk1 FOREIGN KEY (Spot_ID) REFERENCES Spots(Spot_ID) ON DELETE CASCADE;
ALTER TABLE EventParticipants ADD CONSTRAINT EventParticipants_fk0 FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE;
ALTER TABLE EventParticipants ADD CONSTRAINT EventParticipants_fk1 FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;
