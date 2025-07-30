export interface Departement {
  id: string;
  name: string;
  createdAt: string;

}

export interface Function {
  id: string;
  name: string;
  createdAt: string;
}


export interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl?: string; 
  status: boolean;
  functionId: string;
  departementId: string;
  agenceId: string;
  provinceId: string;
  phoneNumbers: string[];
  createdAt: string;
  engagementDate?: string; // Optionnel si c'est nullable
}



export interface Agence {
  province: any;
  id: number;
  name: string;
  codeAgence: string;
  createdAt: string;
  provinceId: number;
  agents: Agent[];
}

export interface AgenceForResponse {
  id: number;
  name: string;
  codeAgence: string;
  createdAt: string;
  provinceId: number;
  province: {
    id: number;
    name: string;
  };

  agents: Agent[];
}

export interface Province {
  id: number;
  name: string;
  createdAt: string;
  agences: Agence[];
  agents: Agent[];
}

export interface ProvinceForResponse {
  id: number;
  name: string;
  agencesCount: number;
  
}

