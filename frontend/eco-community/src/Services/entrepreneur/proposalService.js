import api from "../api.js";

export const proposalService = {
    // Get all proposals for entrepreneur's help requests
    getProposals: async (type = null) => {
        try {
            const url = type
                ? `/entrepreneur/proposals/${type}/`
                : `/entrepreneur/proposals/`;
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Check if help request has reached its requested amount
    checkRequestAmount: async (helpRequestId) => {
        try {
            const response = await api.get(`/entrepreneur/help-requests/${helpRequestId}/amount-status/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update proposal status (accept/refuse)
    updateProposalStatus: async (proposalId, proposalType, status) => {
        try {
            const response = await api.patch(
                `/entrepreneur/proposals/${proposalType}/${proposalId}/`,
                { status }
            );
            return response.data;
        } catch (error) {
            // Handle specific error for exceeding amount
            if (error.response?.data?.error === "Accepting this proposal would exceed the requested amount") {
                throw new Error("Accepting this proposal would exceed your requested amount");
            }
            throw error;
        }
    },

    // Get accepted amount for a help request
    getAcceptedAmount: async (helpRequestId) => {
        if (!helpRequestId) return 0; // Return 0 if helpRequestId is undefined

        try {
            const response = await api.get(`/help-requests/${helpRequestId}/accepted-amount/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching accepted amount:', error);
            return 0; // Return 0 in case of error
        }
    }
};