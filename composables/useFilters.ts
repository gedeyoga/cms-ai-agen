import moment from 'moment';
import 'moment/locale/id'; // Import bahasa Indonesia

export const useFilters = () => {
    
    const formatDate = (dateString : string) => {
        return moment(dateString).locale('id').format('DD MMMM YYYY HH:mm');
    }
  
    return {formatDate};
  }