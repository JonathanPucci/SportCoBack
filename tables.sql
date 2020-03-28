

CREATE TABLE Users (
	user_id serial NOT NULL,
	User_Name TEXT NOT NULL,
	Email VARCHAR(255) NOT NULL UNIQUE,
	Photo_url VARCHAR(255),
	CONSTRAINT Users_pk PRIMARY KEY (user_id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE Events (
	event_id serial NOT NULL,
	Description TEXT,
	Photo TEXT,
	Date DATE NOT NULL,
	Host_ID bigint NOT NULL,
	Spot_ID bigint NOT NULL,
	Participants_min int NOT NULL,
	Participants_max int NOT NULL,
	Sport TEXT NOT NULL,
	CONSTRAINT Events_pk PRIMARY KEY (event_id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE Spots (
	Spot_ID serial NOT NULL,
	Spot_longitude TEXT NOT NULL,
	Spot_latitude TEXT NOT NULL,
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
	Spot_ID serial NOT NULL,
	Field TEXT NOT NULL
) WITH (
  OIDS=FALSE
);




ALTER TABLE Events ADD CONSTRAINT Events_fk0 FOREIGN KEY (Host_ID) REFERENCES Users(user_id) ON DELETE CASCADE;
ALTER TABLE Events ADD CONSTRAINT Events_fk1 FOREIGN KEY (Spot_ID) REFERENCES Spots(Spot_ID) ON DELETE CASCADE;
ALTER TABLE FieldSpots ADD CONSTRAINT FieldSpots_fk1 FOREIGN KEY (Spot_ID) REFERENCES Spots(Spot_ID) ON DELETE CASCADE;
ALTER TABLE EventParticipants ADD CONSTRAINT EventParticipants_fk0 FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE;
ALTER TABLE EventParticipants ADD CONSTRAINT EventParticipants_fk1 FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;
