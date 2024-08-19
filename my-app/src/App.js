import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';
import ReactPaginate from 'react-paginate';

const theme = {
    colors: {
        primary: '#d4af37',
        secondary: '#121212',
        background: '#1a1a1d',
        accent: '#f0e68c',
        text: '#ccc',
        cardBg: '#1a1a1d',
        cardText: '#f0e68c',
    },
    fonts: {
        main: 'Arial, sans-serif',
    },
};

const AppContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: ${(props) => props.theme.fonts.main};
    background-color: ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.primary};
    padding: 30px;
`;

const ContentWrapper = styled.div`
    width: 100%;
    max-width: 1200px;
    text-align: center;
`;

const Header = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
`;

const Title = styled(motion.h1)`
    font-size: 3.5em;
    margin-left: 20px;
    color: ${(props) => props.theme.colors.accent};
`;

const Logo = styled(motion.img)`
    width: 100px;
    height: auto;
`;

const InputsContainer = styled.div`
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 15px;
`;

const InputGroup = styled(motion.div)`
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.colors.cardBg};
    padding: 15px;
    border-radius: 8px;
    width: 150px;

    label {
        margin-bottom: 8px;
        font-weight: bold;
        color: ${(props) => props.theme.colors.accent};
        text-align: center;
    }

    input {
        width: 80px;
        padding: 8px;
        border: 1px solid ${(props) => props.theme.colors.primary};
        background-color: ${(props) => props.theme.colors.background};
        color: ${(props) => props.theme.colors.primary};
        border-radius: 5px;
        text-align: center;
    }
`;

const SearchInput = styled.input`
    width: 300px;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid ${(props) => props.theme.colors.primary};
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.primary};
    text-align: center;
`;

const Button = styled(motion.button)`
    padding: 15px 30px;
    font-size: 1.2em;
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.secondary};
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${(props) => props.theme.colors.accent};
    }
`;

const WeaponsList = styled.div`
    margin-top: 40px;
`;

const CategorySection = styled(motion.div)`
    margin-bottom: 60px;
`;

const CategoryTitle = styled(motion.h2)`
    font-size: 2.5em;
    color: ${(props) => props.theme.colors.accent};
    margin-bottom: 30px;
    border-bottom: 2px solid ${(props) => props.theme.colors.primary};
    padding-bottom: 10px;
`;

const WeaponCard = styled(motion.div)`
    background-color: ${(props) => props.theme.colors.cardBg};
    border-radius: 12px;
    padding: 20px;
    margin: 20px;
    width: 280px;
    text-align: center;
    color: ${(props) => props.theme.colors.cardText};
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.5);

    img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
    }

    h3 {
        margin-top: 15px;
        font-size: 1.8em;
        color: ${(props) => props.theme.colors.accent};
    }

    p {
        margin-top: 15px;
        font-size: 1em;
        color: ${(props) => props.theme.colors.text};
    }

    .requirements {
        margin-top: 15px;
        font-size: 1em;
        color: ${(props) => props.theme.colors.text};
        text-align: left;
    }
`;

const ScalesWith = styled.div`
    margin-top: 15px;
    text-align: left;
`;

const ScalesWithTitle = styled.strong`
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
`;

const ScalesWithList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 5px 0 0;
`;

const ScalesWithItem = styled.li`
    font-size: 0.95em;
    color: ${(props) => props.theme.colors.accent};
`;

// Define renderScalesWith function here
const renderScalesWith = (scalesWith) => {
    if (!scalesWith) return null;

    return (
        <ScalesWith>
            <ScalesWithTitle>Scales With:</ScalesWithTitle>
            <ScalesWithList>
                {Object.keys(scalesWith).map(stat => (
                    <ScalesWithItem key={stat}>
                        {stat}: {scalesWith[stat]}
                    </ScalesWithItem>
                ))}
            </ScalesWithList>
        </ScalesWith>
    );
};

const renderRequirements = (requirements) => (
    <div className="requirements">
        <strong>Requirements:</strong>
        <ul>
            {Object.keys(requirements).map((key) => (
                <li key={key}>{key}: {requirements[key]}</li>
            ))}
        </ul>
    </div>
);

function App() {
    const [Str, setStr] = useState(0);
    const [Dex, setDex] = useState(0);
    const [Int, setInt] = useState(0);
    const [Fai, setFai] = useState(0);
    const [Arc, setArc] = useState(0);
    const [weaponsByCategory, setWeaponsByCategory] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const weaponsPerPage = 10;

    const fetchWeapons = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:3000/weapons?Str=${Str}&Dex=${Dex}&Int=${Int}&Fai=${Fai}&Arc=${Arc}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            const groupedWeapons = data.reduce((acc, weapon) => {
                const category = weapon.category || 'Uncategorized';
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(weapon);
                return acc;
            }, {});

            setWeaponsByCategory(groupedWeapons);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch weapons');
            setLoading(false);
        }
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredWeapons = Object.keys(weaponsByCategory).reduce((acc, category) => {
        const filtered = weaponsByCategory[category].filter(weapon =>
            weapon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length) {
            acc[category] = filtered;
        }
        return acc;
    }, {});

    const paginatedWeapons = Object.keys(filteredWeapons).reduce((acc, category) => {
        const start = currentPage * weaponsPerPage;
        const end = start + weaponsPerPage;
        acc[category] = filteredWeapons[category].slice(start, end);
        return acc;
    }, {});

    return (
        <ThemeProvider theme={theme}>
            <AppContainer>
                <ContentWrapper>
                    <Header
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        >
                            <Logo 
                                src="https://i.postimg.cc/VvgJcLZK/Elden-Ring-Logo.png" 
                                alt="Elden Ring Logo"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                            />
                            <Title>Elden Ring Weapon Finder</Title>
                        </Header>
                        <InputsContainer>
                            <InputGroup
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label>Strength (Str):</label>
                                <input type="number" value={Str} onChange={(e) => setStr(e.target.value)} />
                            </InputGroup>
                            <InputGroup
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label>Dexterity (Dex):</label>
                                <input type="number" value={Dex} onChange={(e) => setDex(e.target.value)} />
                            </InputGroup>
                            <InputGroup
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <label>Intelligence (Int):</label>
                                <input type="number" value={Int} onChange={(e) => setInt(e.target.value)} />
                            </InputGroup>
                            <InputGroup
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <label>Faith (Fai):</label>
                                <input type="number" value={Fai} onChange={(e) => setFai(e.target.value)} />
                            </InputGroup>
                            <InputGroup
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                <label>Arcane (Arc):</label>
                                <input type="number" value={Arc} onChange={(e) => setArc(e.target.value)} />
                            </InputGroup>
                        </InputsContainer>
    
                        <SearchInput
                            type="text"
                            placeholder="Search weapons..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
    
                        <Button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={fetchWeapons}
                        >
                            Find Weapons
                        </Button>
    
                        <WeaponsList>
                            {loading && <p>Loading weapons...</p>}
                            {error && <p>{error}</p>}
                            {!loading && !error && Object.keys(paginatedWeapons).length > 0 ? (
                                Object.keys(paginatedWeapons).map(category => (
                                    <CategorySection
                                        key={category}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                    >
                                        <CategoryTitle>{category}</CategoryTitle>
                                        <div className="category-weapons">
                                            {paginatedWeapons[category].map(weapon => (
                                                <WeaponCard
                                                    key={weapon._id}
                                                    whileHover={{ scale: 1.05 }}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                                >
                                                    <img src={weapon.image} alt={weapon.name} />
                                                    <h3>{weapon.name}</h3>
                                                    <p>{weapon.description}</p>
                                                    {renderRequirements(weapon.requiredAttributes)}
                                                    {renderScalesWith(weapon.scalesWith)}
                                                </WeaponCard>
                                            ))}
                                        </div>
                                    </CategorySection>
                                ))
                            ) : (
                                <p>No weapons found.</p>
                            )}
                        </WeaponsList>
    
                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            pageCount={Math.ceil(Object.keys(filteredWeapons).length / weaponsPerPage)}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                        />
                    </ContentWrapper>
                </AppContainer>
            </ThemeProvider>
        );
    }
    
    export default App;
    
