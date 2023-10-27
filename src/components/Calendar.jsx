import { useEffect, useState } from "react";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";

export const StyleWrapper = styled.div`
    .fc-button.fc-prev-button,
    .fc-button.fc-next-button {
        background: #ffffff !important;
        border: 1px solid #adffd6;
        outline: none;
    }

    .fc-button.fc-prev-button .fc-icon,
    .fc-button.fc-next-button .fc-icon {
        color: #adffd6;
    }

    .fc-button.fc-prev-button:focus,
    .fc-button.fc-next-button:focus {
        outline: none !important;
        border-color: #adffd6 !important;
        background: #ffffff !important;
    }

    .fc-col-header-cell.fc-day {
        background: rgba(59, 174, 160, 0.2);
        color: #3baea0;
    }

    .fc .fc-button-group .fc-button {
        border-radius: 8px;
    }

    .fc-prev-button.fc-button.fc-button-primary {
        margin-right: 5px;
    }

    .fc .fc-daygrid-day-number {
        background-color: #e3e3e3;
        color: #000;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 2px;
        margin-right: 2px;
    }

    .fc .fc-toolbar.fc-header-toolbar {
        margin-top: 1.5em;
        margin-bottom: 1em;
    }

    .fc-daygrid-day-events {
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(59, 174, 160);
        overflow: hidden; 
        margin-left: 5px;
        margin-right: 5px;
        text-overflow: ellipsis "[..]"; /* Show an ellipsis (...) when content overflows */
        max-width: 100%;
        white-space: wrap;
        --fc-event-border-color: none !important;
        --fc-event-text-color: rgba(59, 174, 160) !important;
    }

    .commit-info {
        margin: 2px;
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .commit-info strong {
        font-weight: bold;
    }

    .commit-info p {
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }

    .fc .fc-daygrid-event-harness-abs {
        position: relative;
        right: 0px;
    }

    .fc-daygrid-event {
        white-space: wrap;
    }
`
const GlobalStyles = createGlobalStyle`
    .fc-event {
        background-color: #e3e3e3;

    }
`;

function Calendar() {
    const [calendarEvents, setCalendarEvents] = useState([]);

    useEffect(() => {
        const owner = "wger-project";
        const repo = "react";
        const branch = "master";

        axios
            .get(`https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}`)
            .then((response) => {
                const uniqueDates = {};
                const events = response.data.map((commit) => ({
                    title: "Commit",
                    date: new Date(commit.commit.author.date),
                    extendedProps: {
                        authorName: commit.commit.author.name,
                        authorEmail: commit.commit.author.email,
                    },
                }))
                    .filter((event) => {
                        const dateStr = event.date.toISOString().split('T')[0];
                        if (!uniqueDates[dateStr]) {
                            uniqueDates[dateStr] = true;
                            return true;
                        }
                        return false;
                    });
                setCalendarEvents(events);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, []);

    const eventContent = (arg) => {
        return (
            <div className="commit-info">
                <strong>{arg.event.extendedProps.authorName}</strong>
                <p>{arg.event.extendedProps.authorEmail}</p>
            </div>
        )
    };

    return (
        <div>
            <StyleWrapper>
                <GlobalStyles />
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView={'dayGridMonth'}
                    headerToolbar={{
                        start: "title",
                        center: "",
                        end: "prev,next",
                    }}
                    showNonCurrentDates={false}
                    height={700}
                    eventContent={eventContent}
                    events={calendarEvents}
                />
            </StyleWrapper>
        </div>
    );
}

export default Calendar;