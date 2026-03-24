
import { Box, Typography, Stack } from "@mui/material";
import { Suspense } from "react";
import moment from "moment";
import ActorSpider from "../ActorSpider/ActorSpider";
import ActorTimeline from "../ActorTimeline/ActorTimeline";
import ActorNode from "../../ActorNode/ActorNode";
import NodeSwitch from "../NodeSwitch";

import styles from "../../../styles/global_variables.scss";

export default function ActorStatsPanel({
  actor,
  actorInfo,
  fullPeriod,
  start,
  end,
  eventTypeColours,
  timelineInfo,
  gw_number,
  actors,
  displayCollaborations,
  displayOppositions,
  showFull,
  handlePeriodChange,
  getRelevantEventCounts,
}) {
  return (
    <div className="actor-card-tab-wrapper">
      <div className="actor-card-actor-wrapper">
        {/* Actor Info (Spider & Interactions) */}
        <Box
          className="actor-card-actor-info"
          sx={{
            gap: { xs: "20px" },
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          {/* Spider Chart */}
          <Box
            className="actor-card-stats-wrapper"
            sx={{ maxWidth: { xs: "50%", md: "30%" } }}
          >
            <Suspense>
              <ActorSpider
                full={fullPeriod}
                event_counts_period={actorInfo.event_counts_period}
                event_counts_full={actor.eventTypeSummary}
                eventTypeColours={eventTypeColours}
              />
            </Suspense>
          </Box>

          {/* Interactions */}
          <Box className="actor-card-interaction-wrapper">
            <Box
              className="actor-card-interaction-title"
              sx={{
                marginTop: { xs: "5px", md: "0" },
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                gap: { xs: "5px", sm: "0" },
              }}
            >
              <Typography fontSize="0.8rem" fontWeight="bold" paddingX="5px">
                Collaborations
              </Typography>
              {!fullPeriod && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  gap="10px"
                  sx={{
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    padding: { xs: "0 5px", sm: "0" },
                  }}
                >
                  <Typography fontSize="0.8rem">
                    Period ({moment(start).format("DD.MM.YY")} -{" "}
                    {moment(end).format("DD.MM.YY")})
                  </Typography>
                  <NodeSwitch
                    selectNeighbours={showFull}
                    onChange={handlePeriodChange}
                  />
                </Stack>
              )}
              <Typography fontSize="0.8rem" fontWeight="bold" paddingX="5px">
                Oppositions
              </Typography>
            </Box>

            <Box
              className="actor-card-both-interactions"
              sx={{
                gap: { xs: "20px", md: "0px" },
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              {/* Collaborations List */}
              <div className="actor-card-interaction">
                {displayCollaborations.map((actorItem) => (
                  <ActorNode
                    gw_number={gw_number}
                    key={`actor-item-${actorItem.id}`}
                    className="home-actor-item"
                    actor={actorItem}
                    actors={actors}
                    start={start}
                    end={end}
                    displayNumber={getRelevantEventCounts(
                      actorItem.getName(),
                      "collabs"
                    )}
                    fullPeriod={fullPeriod}
                    eventTypeColours={eventTypeColours}
                  />
                ))}
              </div>

              {/* Oppositions List */}
              <Box
                className="actor-card-interaction right"
                sx={{ maxWidth: { xs: "100%", md: "50%" } }}
              >
                {displayOppositions.map((actorItem) => (
                  <ActorNode
                    gw_number={gw_number}
                    key={`actor-item-${actorItem.id}`}
                    className="home-actor-item"
                    actor={actorItem}
                    actors={actors}
                    start={start}
                    end={end}
                    displayNumber={getRelevantEventCounts(
                      actorItem.getName(),
                      "oppos"
                    )}
                    fullPeriod={fullPeriod}
                    eventTypeColours={eventTypeColours}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Events Summary + Timeline */}
        <Box
          className="actor-card-actor-info"
          sx={{
            gap: { xs: "20px" },
            flexDirection: { xs: "column", md: "row" },
            marginTop: { xs: "20px", md: "0" },
            paddingBottom: { xs: "20px", md: "0" },
          }}
        >
          {/* Events Stats */}
          <Box
            className="actor-card-num-events-wrapper"
            sx={{ width: { xs: "100%", md: "30%" } }}
          >
            <Typography fontSize="1rem">Events</Typography>
            <Box
              className="actor-card-num-events"
              sx={{ flexDirection: { xs: "column", md: "row" } }}
            >
              {!fullPeriod && (
                <div className="actor-card-num-item period">
                  <Typography fontSize="0.8rem">In selected Period</Typography>
                  <Typography fontSize="4rem" marginRight="0.8rem" lineHeight="1">
                    {actorInfo.period_entries}
                  </Typography>
                  <div className="actor-dates">
                    <Typography fontSize="0.8rem">
                      last: {actorInfo.period_newest}
                    </Typography>
                  </div>
                </div>
              )}
              <div className="actor-card-num-item">
                <Typography fontSize="0.8rem" sx={{ color: styles.neutralDark }}>
                  Overall
                </Typography>
                <div className="actor-num-events">
                  <Typography
                    fontSize="4rem"
                    lineHeight="1"
                    marginRight="0.8rem"
                    sx={{ color: styles.neutralDark }}
                  >
                    {actor.eventReportIds.length}
                  </Typography>
                  <div className="actor-dates">
                    <Typography
                      fontSize="0.8rem"
                      sx={{ color: styles.neutralDark }}
                    >
                      last: {actorInfo.overall_newest}
                    </Typography>
                  </div>
                </div>
              </div>
            </Box>
          </Box>

          {/* Timeline */}
          <Suspense>
            <ActorTimeline
              start={start}
              end={end}
              timelineInfo={timelineInfo}
            />
          </Suspense>
        </Box>
      </div>
    </div>
  );
}
