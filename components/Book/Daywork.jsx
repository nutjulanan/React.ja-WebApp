import React, { useEffect, useState, useCallback, useRef } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateCalendar, PickersDay, DayCalendarSkeleton } from '@mui/x-date-pickers';

const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables

async function fetchHighlightedDays(date, weeklyHolidays, { signal }) {
    return new Promise((resolve, reject) => {
        // Check if the fetch operation has been aborted
        if (signal.aborted) {
            return reject(new DOMException('The operation was aborted.', 'AbortError'));
        }

        const daysInMonth = date.daysInMonth();
        let daysToHighlight = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDayDate = date.date(day);
            const dayOfWeek = currentDayDate.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            // console.log("/////////////////////////////////////////////////////////////////////////////")
            // Determine if the day should be highlighted based on the weeklyHolidays configuration
            const shouldHighlight = (() => {
                switch (dayOfWeek) {
                    case 0: return !weeklyHolidays.sunday;
                    case 1: return !weeklyHolidays.monday;
                    case 2: return !weeklyHolidays.tuesday;
                    case 3: return !weeklyHolidays.wednesday;
                    case 4: return !weeklyHolidays.thursday;
                    case 5: return !weeklyHolidays.friday;
                    case 6: return !weeklyHolidays.saturday;
                    default: return false; // This should never happen
                }
            })();

            if (shouldHighlight) {
                daysToHighlight.push(day);
            }
        }

        // Simulate a delay to mimic asynchronous behavior
        setTimeout(() => {
            // Check again if the operation has been aborted before resolving
            if (signal.aborted) {
                return reject(new DOMException('The operation was aborted.', 'AbortError'));
            }
            resolve(daysToHighlight);
        }, 100); // Adjust delay as needed
    });
}
// Assuming fetchHolidays is called within a React component or a custom hook

async function fetchHolidays(date, { signal }) {
    try {
        const response = await axios.get(`${VITE_API_URL}/fetchAllHolidays`, { signal });
        const holidaysDatabase = response.data;

        const monthIndex = date.month(); // 0-based index of the month
        const year = date.year();
        const daysToHighlight = holidaysDatabase
            .filter(holiday => {
                const holidayDate = dayjs(holiday.date);
                return holiday.workdaystatus === true && holidayDate.month() === monthIndex && holidayDate.year() === year;
            })
            .map(holiday => dayjs(holiday.date).date());

        return daysToHighlight; // Return the result directly
    } catch (error) {
        console.error('Error fetching holidays:', error);
        throw error; // Rethrow or handle as needed
    }
}

async function fetchWorkDays(date, { signal }) {
    try {
        const response = await axios.get(`${VITE_API_URL}/fetchAllReservation`, { signal });
        const workDaysDatabase = response.data;

        // console.log(workDaysDatabase)
        const monthIndex = date.month();
        const year = date.year();
        const daysToHighlight = workDaysDatabase
            .filter(day => {
                const dayDate = dayjs(day.date);
                return day.workdaystatus === true && dayDate.month() === monthIndex && dayDate.year() === year;
            })
            .map(day => dayjs(day.date).date());

        return daysToHighlight;
    } catch (error) {
        console.error('Error fetching work days:', error);
        throw error;
    }
}


// const useWeeklyHolidays = () => {
//     const [weeklyHolidays, setWeeklyHolidays] = useState({
//         monday: true,
//         tuesday: true,
//         wednesday: true,
//         thursday: true,
//         friday: true,
//         saturday: false,
//         sunday: false,
//     });

//     useEffect(() => {
//         const fetchWeeklyHolidays = async () => {
//             try {
//                 const response = await axios.get(`${VITE_API_URL}/weekly_schedule/1`);
//                 setWeeklyHolidays(response.data);
//                 console.log(response.data)
//             } catch (error) {
//                 console.error('Error fetching weekly holidays:', error);
//             }
//         };

//         fetchWeeklyHolidays();
//     }, []);

//     return weeklyHolidays;
// };

const useWeeklyHolidays = (updateTrigger) => {
    const [weeklyHolidays, setWeeklyHolidays] = useState({
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
    });

    useEffect(() => {
        const fetchWeeklyHolidays = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/weekly_schedule/1`);
                setWeeklyHolidays(response.data);

            } catch (error) {
                console.error('Error fetching weekly holidays:', error);
            }
        };

        fetchWeeklyHolidays();
    }, [updateTrigger]); // Depend on updateTrigger to refetch

    return weeklyHolidays;
};


const useDayHighlighting = (initialValue, weeklyHolidays) => {
    const [highlightedDays, setHighlightedDays] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [workDays, setWorkDays] = useState([]);

    const requestAbortController = useRef(null);


    const fetchDays = useCallback((date) => {
        setIsLoading(true);
        const controller = new AbortController();
        const signal = controller.signal;



        Promise.all([
            fetchHighlightedDays(date, weeklyHolidays, { signal }),
            fetchHolidays(date, { signal }),
            fetchWorkDays(date, { signal })
        ]).then(([highlighted, holidays, workDays]) => {
            setHighlightedDays(highlighted);
            setHolidays(holidays);
            setWorkDays(workDays);
            setIsLoading(false);
        }).catch((error) => {
            if (error.name !== 'AbortError') {
                console.error(error);
            }
            setIsLoading(false);
        });

        requestAbortController.current = controller;
    }, [weeklyHolidays]);

    useEffect(() => {
        fetchDays(initialValue);

        // return () => requestAbortController.current?.abort();
    }, [fetchDays]);

    return { highlightedDays, holidays, isLoading, fetchDays, workDays };
};


function ServerDay(props, highlightedDays, holidays, workDays) {
    const { day, outsideCurrentMonth, ...other } = props;

    const safeHighlightedDays = highlightedDays || [];
    const safeHolidays = holidays || [];
    const safeWorkDays = workDays || [];

    const isHighlighted = !outsideCurrentMonth && safeHighlightedDays.includes(day.date());
    const isHoliday = !outsideCurrentMonth && safeHolidays.includes(day.date());
    const isWorkDay = !outsideCurrentMonth && safeWorkDays.includes(day.date());
    // console.log(isWorkDay)
    let badgeContent = undefined;

    if (isWorkDay && isHoliday) { // Condition for work days
        badgeContent = (<><span>🌟</span><span>🏖️</span></>); // Customize this as needed
    } else if (isHighlighted && isHoliday) {
        badgeContent = (<><span>🌚</span><span>🏖️</span></>);
    } else if (isHighlighted) {
        badgeContent = '🌚';
    } else if (isHoliday) {
        badgeContent = '🏖️';
    } else if (isWorkDay) {
        badgeContent = '🌟';
    }

    return (
        <Badge
            key={day.toString()}
            overlap="circular"
            badgeContent={badgeContent}
        >
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
    );
}

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
export default function Daywork() {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
    let navigate = useNavigate();
    const fetchPermission = async () => {
        try {
            const data_id = JSON.parse(localStorage.getItem('data_id'));
            const response๘work_roles_permissions = await axios.get(`${VITE_API_URL}/work_roles_permissions/${data_id.id}`);
            const additionalInfos = response๘work_roles_permissions.data;
            const all_role = []
            for (const additionalInfo of additionalInfos) {
                if (additionalInfo.role_id !== undefined) {
                    const responseroles = await axios.get(`${VITE_API_URL}/fetchroles_permissionsById/${additionalInfo.role_id}`);
                    const additionalInforoles = responseroles.data;
                    all_role.push({
                        ...additionalInforoles,
                    });
                } else {
                    console.error('role_id is undefined for item:', item);
                }
            }
            if (!all_role.some(permission => permission["garages"] === true)) {
                navigate('/garage');
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    }
    useEffect(() => {
        fetchPermission()
    }, [])
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const initialValue = dayjs();
    const [updateTrigger, setUpdateTrigger] = useState(Date.now());
    const weeklyHolidays = useWeeklyHolidays(updateTrigger);

    const { highlightedDays, holidays, isLoading, fetchDays, workDays } = useDayHighlighting(initialValue, weeklyHolidays);

    const handleMonthChange = useCallback((date) => {
        fetchDays(date);
    }, [fetchDays]);


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [schedule, setSchedule] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        update_record: ''
    });

    const fetchSchedule = async () => {

        try {
            const response = await axios.get(`${VITE_API_URL}/weekly_schedule/${1}`);
            setSchedule(response.data);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);


    const handleChange = (event) => {
        const { name, checked } = event.target;
        setSchedule(prevSchedule => ({
            ...prevSchedule,
            [name]: checked,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data_id = JSON.parse(localStorage.getItem('data_id'));
        schedule.update_record = data_id.full_name;
        try {
            await axios.put(`${VITE_API_URL}/weekly_schedule/${1}`, schedule);
            // หลังจากอัพเดทสำเร็จ, ดึงข้อมูลปฏิทินใหม่
            setUpdateTrigger(Date.now());
            await fetchSchedule(); // อัพเดทตารางวันหยุด
            await fetchDays(dayjs()); // ดึงข้อมูลปฏิทินใหม่โดยใช้วันปัจจุบันหรือวันที่เลือก
        } catch (error) {
            console.error('Error updating schedule:', error);
            alert('Error updating schedule');
        }
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div class="container mx-auto p-4">
            <h3 className="text-2xs font-bold mb-4 text-center">ตารางวันทำงาน</h3>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {/* <div className="flex-1">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-5">

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {Object.entries(schedule).map(([day, value]) => {
                                const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

                                return daysOfWeek.includes(day) ? (
                                    <div key={day} class="form-control">
                                        <label class="label cursor-pointer justify-start gap-2">
                                            <input type="checkbox" name={day} checked={value} onChange={handleChange} class="toggle toggle-primary" />
                                            <span class="label-text">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                                        </label>
                                    </div>
                                ) : null;
                            })}
                        </div>
                        <div class="flex justify-end">
                        </div>
                        <button type="submit" class="btn btn-primary">Update Schedule</button>
                    </form>
                </div> */}
                <div className="flex-1">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            defaultValue={dayjs()}
                            // value ={dayjs()}
                            loading={isLoading}
                            onMonthChange={handleMonthChange}
                            renderLoading={() => <DayCalendarSkeleton />}
                            slots={{
                                day: (props) => ServerDay(props, highlightedDays, holidays, workDays),
                            }}
                            sx={{ transform: 'scale(1.0)' }}
                        />
                    </LocalizationProvider>
                </div>
            </div>
        </div>
    );
}
