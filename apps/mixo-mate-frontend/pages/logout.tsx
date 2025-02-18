import React, { useEffect, useRef } from 'react';
import { useAuth } from "@/clientApi/hooks/useAuth";
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function Logout() {
    const { authApi } = useAuth();
    const toast = useRef(null); 

    useEffect(() => {
        const processLogout = async () => {
            if (authApi) {
                try {
                    toast.current.show({ severity: 'info', summary: 'Info', detail: 'Logging out...', life: 3000 });
                    await authApi.logout();
                    window.location.replace('/');
                } catch (error) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to log out. Please try again.', life: 5000 });
                }
            }
        };

        processLogout();
    }, [authApi]);

    return (
        <div className="flex justify-center items-center h-screen">
            <Toast ref={toast} />
        </div>
    );
}

export default Logout;
