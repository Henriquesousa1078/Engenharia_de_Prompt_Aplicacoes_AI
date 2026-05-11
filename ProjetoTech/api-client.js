// ========================================
// Cliente da API de Futebol
// Integração com API-Football
// ========================================

class FootballAPIClient {
    constructor() {
        // Usar API pública ou mock data
        this.baseURL = 'https://api.api-football.com/v3';
        this.apiKey = 'YOUR_API_KEY'; // Substituir com chave real
        this.mockMode = true; // Usar dados mock para desenvolvimento
    }

    // ========================================
    // MÉTODOS DE JOGOS
    // ========================================

    /**
     * Buscar próximos jogos
     * @param {string} leagueId - ID do campeonato
     * @param {number} days - Número de dias à frente
     */
    async getUpcomingMatches(leagueId = '', days = 7) {
        if (this.mockMode) {
            return this.getMockMatches();
        }
        try {
            const from = new Date();
            const to = new Date();
            to.setDate(to.getDate() + days);

            const fromStr = from.toISOString().split('T')[0];
            const toStr = to.toISOString().split('T')[0];

            const endpoint = `${this.baseURL}/fixtures?from=${fromStr}&to=${toStr}${leagueId ? `&league=${leagueId}` : ''}`;

            const response = await fetch(endpoint, {
                headers: {
                    'x-apisports-key': this.apiKey
                }
            });

            const data = await response.json();
            return data.response || [];
        } catch (error) {
            console.error('Erro ao buscar jogos:', error);
            return this.getMockMatches();
        }
    }

    /**
     * Buscar detalhes de um jogo específico
     */
    async getMatchDetails(fixtureId) {
        if (this.mockMode) {
            const matches = this.getMockMatches();
            return matches.find(m => m.fixture.id === parseInt(fixtureId)) || null;
        }
        try {
            const response = await fetch(`${this.baseURL}/fixtures?id=${fixtureId}`, {
                headers: { 'x-apisports-key': this.apiKey }
            });
            const data = await response.json();
            return data.response?.[0] || null;
        } catch (error) {
            console.error('Erro ao buscar detalhes do jogo:', error);
            return null;
        }
    }

    // ========================================
    // MÉTODOS DE TABELAS
    // ========================================

    /**
     * Buscar classificação de um campeonato
     */
    async getStandings(leagueId, season = 2024) {
        if (this.mockMode) {
            return this.getMockStandings(leagueId);
        }
        try {
            const response = await fetch(`${this.baseURL}/standings?league=${leagueId}&season=${season}`, {
                headers: { 'x-apisports-key': this.apiKey }
            });
            const data = await response.json();
            return data.response?.[0]?.league?.standings || [];
        } catch (error) {
            console.error('Erro ao buscar classificação:', error);
            return this.getMockStandings(leagueId);
        }
    }

    // ========================================
    // MÉTODOS DE TIMES
    // ========================================

    /**
     * Buscar informações de um time
     */
    async getTeamInfo(teamId) {
        if (this.mockMode) {
            return this.getMockTeamInfo(teamId);
        }
        try {
            const response = await fetch(`${this.baseURL}/teams?id=${teamId}`, {
                headers: { 'x-apisports-key': this.apiKey }
            });
            const data = await response.json();
            return data.response?.[0] || null;
        } catch (error) {
            console.error('Erro ao buscar time:', error);
            return null;
        }
    }

    // ========================================
    // DADOS MOCK PARA DESENVOLVIMENTO
    // ========================================

    getMockMatches() {
        const today = new Date();
        const matches = [];

        for (let i = 0; i < 10; i++) {
            const matchDate = new Date(today);
            matchDate.setDate(matchDate.getDate() + i);

            const timeHour = 14 + (i % 8);
            const timeMin = (i % 2) * 30;

            matches.push({
                fixture: {
                    id: 1000 + i,
                    date: matchDate.toISOString(),
                    timestamp: Math.floor(matchDate.getTime() / 1000),
                    timezone: 'America/Sao_Paulo',
                    referee: 'Árbitro ' + (i + 1),
                    venue: {
                        name: 'Estádio ' + (i + 1),
                        city: 'Cidade ' + (i + 1)
                    },
                    status: {
                        long: i === 0 ? 'Em andamento' : 'Agendado',
                        short: i === 0 ? 'LIVE' : 'NS'
                    }
                },
                league: {
                    id: 71 + (i % 3),
                    name: ['Premier League', 'Série A Brasil', 'LaLiga'][i % 3],
                    country: ['England', 'Brazil', 'Spain'][i % 3],
                    logo: 'https://via.placeholder.com/30',
                    flag: 'https://via.placeholder.com/30',
                    season: 2024,
                    round: 'Round ' + (i + 1)
                },
                teams: {
                    home: {
                        id: 33 + i,
                        name: ['Manchester United', 'Liverpool', 'Chelsea', 'Arsenal', 'Tottenham', 'Flamengo', 'Palmeiras', 'São Paulo', 'Corinthians', 'Real Madrid'][i % 10],
                        logo: 'https://via.placeholder.com/50',
                        winner: i % 2 === 0 ? true : null
                    },
                    away: {
                        id: 43 + i,
                        name: ['Manchester City', 'Leicester', 'Everton', 'Leeds', 'Newcastle', 'Botafogo', 'Grêmio', 'Atlético Mineiro', 'Santos', 'Barcelona'][i % 10],
                        logo: 'https://via.placeholder.com/50',
                        winner: i % 2 === 1 ? true : null
                    }
                },
                goals: {
                    home: i % 3,
                    away: i % 2
                },
                score: {
                    halftime: { home: i % 2, away: i % 2 },
                    fulltime: { home: i % 3, away: i % 2 },
                    extratime: { home: null, away: null },
                    penalty: { home: null, away: null }
                },
                broadcast: {
                    platforms: ['Globo', 'SporTV', 'YouTube'][Math.floor(Math.random() * 3)],
                    link: 'https://example.com'
                }
            });
        }

        return matches;
    }

    getMockStandings(leagueId) {
        const standings = [[
            { rank: 1, team: { id: 33, name: 'Manchester City', logo: 'https://via.placeholder.com/50' }, points: 89, goalsDiff: 67, played: 30 },
            { rank: 2, team: { id: 34, name: 'Arsenal', logo: 'https://via.placeholder.com/50' }, points: 84, goalsDiff: 61, played: 30 },
            { rank: 3, team: { id: 35, name: 'Liverpool', logo: 'https://via.placeholder.com/50' }, points: 82, goalsDiff: 58, played: 30 },
            { rank: 4, team: { id: 36, name: 'Aston Villa', logo: 'https://via.placeholder.com/50' }, points: 76, goalsDiff: 45, played: 30 },
            { rank: 5, team: { id: 37, name: 'Tottenham', logo: 'https://via.placeholder.com/50' }, points: 72, goalsDiff: 42, played: 30 },
            { rank: 6, team: { id: 38, name: 'Chelsea', logo: 'https://via.placeholder.com/50' }, points: 65, goalsDiff: 35, played: 30 },
            { rank: 7, team: { id: 39, name: 'Manchester United', logo: 'https://via.placeholder.com/50' }, points: 60, goalsDiff: 28, played: 30 },
            { rank: 8, team: { id: 40, name: 'Newcastle', logo: 'https://via.placeholder.com/50' }, points: 58, goalsDiff: 22, played: 30 },
            { rank: 9, team: { id: 41, name: 'West Ham', logo: 'https://via.placeholder.com/50' }, points: 52, goalsDiff: 15, played: 30 },
            { rank: 10, team: { id: 42, name: 'Brighton', logo: 'https://via.placeholder.com/50' }, points: 50, goalsDiff: 10, played: 30 }
        ]];

        return standings[0];
    }

    getMockTeamInfo(teamId) {
        return {
            team: {
                id: teamId,
                name: 'Time Mock',
                code: 'TMO',
                country: 'País',
                founded: 2000,
                national: false,
                logo: 'https://via.placeholder.com/100'
            },
            venue: {
                id: teamId,
                name: 'Estádio Mock',
                address: 'Endereço Mock',
                city: 'Cidade Mock',
                capacity: 70000,
                surface: 'grass',
                image: 'https://via.placeholder.com/200'
            }
        };
    }
}

// Exportar instância única
const apiClient = new FootballAPIClient();