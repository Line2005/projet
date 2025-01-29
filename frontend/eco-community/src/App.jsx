import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProjectCreation from "./pages/entreprneur/project/creation/ProjectCreation.jsx";
import ProjectsPage from "./pages/entreprneur/project/Project.jsx";
import EcoCommunity from "./pages/Layout.jsx";
import HelpRequestPage from "./pages/entreprneur/Request/creation/Request.jsx";
import HelpRequestsListPage from "./pages/entreprneur/Request/RequestDisaplay/RequestDisplay.jsx";
import CreateAnnouncementPage from "./pages/ONG-Associations/Announcement/creation/AnnouncementCreation.jsx";
import OpportunityPage from "./pages/entreprneur/Opportunities/Opportunities.jsx";
import NGOAnnouncementsPage from "./pages/ONG-Associations/Announcement/Annoucement.jsx";
import NGOEventsPage from "./pages/ONG-Associations/Events/Events.jsx";
import CreateEventPage from "./pages/ONG-Associations/Events/creation/EventsCreation.jsx";
import EditEventPage from "./pages/ONG-Associations/Events/editing/EditingEvents.jsx";
import ProjectRequestsInvestorPage from "./pages/Investisseur/Dashboard/Dashboard.jsx";
import FinancialHelpProposalPage from "./pages/Investisseur/Help/financial/FinancialHelp.jsx";
import TechnicalHelpProposalPage from "./pages/Investisseur/Help/technical/TechnicalHelp.jsx";
import HelpProposalsPage from "./pages/Investisseur/HelpProposal/HelpProposal.jsx";
import AnnouncePage from "./pages/Investisseur/Announce/Announce.jsx";
import HelpPage from "./pages/entreprneur/proposition/Proposition.jsx";
import CollaboratorPage from "./pages/entreprneur/collaborator/Collaborator.jsx";
import InvestorCollaboratorsPage from "./pages/Investisseur/collaboration/Collab.jsx";
import SettingsPage from "./pages/entreprneur/settings/Settings.jsx";
import AdminDashboard from "./pages/Admin/Dashboard/Dashboard.jsx";
import AdminProject from "./pages/Admin/Project/ProjectValidation.jsx";


// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const userRole = localStorage.getItem('userRole');
    const isAuthenticated = !!localStorage.getItem('accessToken');

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<EcoCommunity />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/*<Route path="/admin/dashboard" element={ <ProtectedRoute allowedRoles={["admin"]}> <AdminDashboard /> </ProtectedRoute>} />*/}

                // Entrepreneur
                //Role base authentication
                <Route path="/entrepreneur/project" element={ <ProtectedRoute allowedRoles={['entrepreneur']}> <ProjectsPage /> </ProtectedRoute> }/>
                <Route path="/entrepreneur/create-project" element={<ProjectCreation />} />
                <Route path="/entrepreneur/request" element={<HelpRequestPage />} />
                <Route path="/entrepreneur/demandes" element={<HelpRequestsListPage />} />
                <Route path="/entrepreneur/help" element={<HelpPage />} />
                <Route path="/entrepreneur/opportunity" element={<OpportunityPage />} />
                <Route path="/entrepreneur/collaborators" element={<CollaboratorPage />} />
                <Route path="/entrepreneur/settings" element={<SettingsPage />} />

                // Investors part
                //Role base authentication
                <Route path="/investors/project" element={ <ProtectedRoute allowedRoles={['investor']}> <ProjectRequestsInvestorPage /> </ProtectedRoute>} />
                <Route path="/investors/financialHelp" element={<FinancialHelpProposalPage />} />
                <Route path="/investors/technicalHelp" element={<TechnicalHelpProposalPage />} />
                <Route path="/investors/proposals" element={<HelpProposalsPage />} />
                <Route path="/investors/opportunity" element={<AnnouncePage />} />
                <Route path="/investors/collaborators" element={<InvestorCollaboratorsPage />} />


                // ONG Association Parts
                //Role base authentication
                <Route path="/association/announce" element={ <ProtectedRoute allowedRoles={['ONG-Association']}> <NGOAnnouncementsPage /> </ProtectedRoute>} />
                <Route path="/association/create-announcement" element={<CreateAnnouncementPage />} />
                <Route path="/association/events" element={<NGOEventsPage />} />
                <Route path="/association/create-events" element={<CreateEventPage />} />
                <Route path="/association/editing-events" element={<EditEventPage />} />

                // Admin Parts
                //Role base authentication
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/project" element={<AdminProject />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App