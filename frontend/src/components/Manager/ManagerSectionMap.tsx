import ActivitySchedulingView from "./sections/ActivitySchedulingView";
import AgencyArtistsView from "./sections/AgencyArtists";
import AgencyArtistsCompleteInfo from "./sections/AgencyArtistsCompleteInfo";
import AgencyApprenticesView from "./sections/AgencyApprentices";
import ArtistsWithDebutAndContractsView from "./sections/ArtistsWithDebutAndContractsView";
import GroupCalendarView from "./sections/CalendarGroupActivities";
import CollaborationManagement from "./sections/CollaborationManagement";
import EvaluationManagement from "./sections/Evaluation/EvaluationsManagement";
import GroupManagement from "./sections/Group";
import SuccessManagement from "./sections/Success/SuccessManagement";
import AlbumAssignmentView from "./sections/AlbumAsig";
import ArtistIncomeReportView from "./sections/IncomesArtists";

export const sectionComponents = {
    active_apprentice: AgencyApprenticesView,
    active_artists: AgencyArtistsView,
    group_management: GroupManagement,
    activities_management: ActivitySchedulingView,
    success_management: SuccessManagement,
    collaboration_management: CollaborationManagement,
    evaluations_management: EvaluationManagement,
    artists_changes: AgencyArtistsCompleteInfo,
    calendar_group: GroupCalendarView,
    artist_debut_contract: ArtistsWithDebutAndContractsView,
    album_management:AlbumAssignmentView,
    incomes_management: ArtistIncomeReportView
    
};
