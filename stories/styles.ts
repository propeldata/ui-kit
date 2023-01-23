import styled from 'styled-components'

export const Card = styled.div`
  padding: 10px;
  width: 100%;
  box-sizing: border-box;

  border-radius: 4px;

  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: #ffffff;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.14);
`

export const CardHeader = styled.div`
  color: #8892a7;
  margin: 5px 0;
`

export const ProdValue = styled.span`
  font-size: 2rem;
  margin: 10px 0;
`

export const Nav = styled.nav`
  background-color: #ffffff;
  height: 70px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 47px;
`

export const NavContent = styled.div`
  display: flex;
  align-items: center;
  gap: 120px;
`

interface NavItemProps {
  selected?: boolean
}

export const NavItem = styled.div<NavItemProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  gap: 9.5px;
  color: ${({ selected }) => (selected ? '#2566EA' : '#8892A7')};
  cursor: pointer;
`

export const SelectedBar = styled.div`
  background-color: #2566ea;
  height: 5px;
  width: 121px;
  border-radius: 5px 5px 0 0;

  position: absolute;
  top: 65px;
`

export const Body = styled.div`
  background-color: #f8f9fb;

  height: max-content;
`

export const Main = styled.main`
  margin: 20px;
`

export const ProdsContainer = styled.div`
  display: flex;
  gap: 15px;

  width: 100%;
  height: 115px;
`

export const DashboardGrid = styled.div`
  display: grid;
  grid-gap: 10px;

  margin: 5px 0;

  grid-template-areas: 'sales sales top-stores' 'target sales-volume top-stores';
`

export const SalesCard = styled(Card)`
  grid-area: sales;
  max-height: 300px;
`

export const TopStoresCard = styled(Card)`
  grid-area: top-stores;
`

export const TargetCard = styled(Card)`
  grid-area: target;
`

export const SalesVolumeCard = styled(Card)`
  grid-area: sales-volume;
`
