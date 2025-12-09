import ActivitySchedulingView from "./sections/ActivitySchedulingView";
import AgencyArtistsView from "./sections/AgencyArtists";
import AgencyApprenticesView from "./sections/ApprenticesByAgency";
import GroupManagement from "./sections/Group";
import SuccessManagement from "./sections/Success/SuccessManagement";

export const sectionComponents = {
    active_apprentice: AgencyApprenticesView,
    active_artists: AgencyArtistsView,
    group_management: GroupManagement,
    activities_management: ActivitySchedulingView,
    success_management: SuccessManagement
};
