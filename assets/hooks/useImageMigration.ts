import { useEffect } from 'react'
import axios from 'axios'
import InstallationStatusModel from '@/types/InstallationStatusModel'

function useImageMigration(
    installationStatus: EntityState<InstallationStatusModel>,
    setMigratingImages: SetState<boolean>,
    entitiesToUpdate: Array<EntityState>
): void {
    useEffect(() => {
        if (installationStatus.isLoading) {
            return;
        }

        const updateToV16 = async (): Promise<void> => {
            try {
                setMigratingImages(true)
                const response = await axios.get('/api/image-migration')
                if (response.status === 200) {
                    entitiesToUpdate.forEach(entity => entity.load())
                    setMigratingImages(false)
                }
            } catch (error) {
                // ignore
            }
        }

        if (!installationStatus.data.updateV16) {
            updateToV16()
        }
    }, [installationStatus.isLoading]);
}

export default useImageMigration
