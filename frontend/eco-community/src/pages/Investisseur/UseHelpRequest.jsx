import {useEffect, useState} from "react";
import api from "../../Services/api.js";

export const useHelpRequest = (requestId) => {
    const [helpRequest, setHelpRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHelpRequest = async () => {
            if (!requestId) return;

            try {
                setLoading(true);
                const response = await api.get(`/help-requests/${requestId}/`);
                setHelpRequest(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch help request details');
            } finally {
                setLoading(false);
            }
        };

        fetchHelpRequest();
    }, [requestId]);

    return { helpRequest, loading, error };
};