import { Suspense ,lazy } from "react";
import { Stack, Typography } from "@mui/material";
import moment from "moment";
import NodeSwitch from "../NodeSwitch";

import styles from "../../../styles/global_variables.scss";

const EventsCard = lazy(() => import("../../EventsCard/EventsCard"));

export default function ActorEventsTab({
  fullPeriod,
  start,
  end,
  eventsPeriodChecked,
  handleEventsPeriodChange,
  gw_number,
  actors,
  actor,
  eventTypeColours,
}) {
  return (
    <div className="actor-card-tab-wrapper">
      {!fullPeriod ? (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            padding: { xs: "20px 20px" },
            gap: "20px",
            backgroundColor: styles.primaryColor,
            marginBottom: "5px",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography fontSize="16px" color={styles.extraDarkBlue}>
            Period ({moment(start).format("DD.MM.YY")} -{" "}
            {moment(end).format("DD.MM.YY")})
          </Typography>
          <NodeSwitch
            selectNeighbours={eventsPeriodChecked}
            onChange={handleEventsPeriodChange}
          />
        </Stack>
      ) : null}

      <Suspense fallback={<div>Loading events...</div>}>
        <EventsCard
          gw_number={gw_number}
          full={eventsPeriodChecked}
          actors={actors}
          mainActors={[actor]}
          start={start}
          end={end}
          eventTypeColours={eventTypeColours}
        />
      </Suspense>
    </div>
  );
}
