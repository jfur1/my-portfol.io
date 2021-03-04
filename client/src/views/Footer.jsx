export const Footer = () => {
    return(
        <footer style={{
            height: '140px',
            lineHeight: '140px',
            backgroundColor: '#455a64',
            position: 'relative'
        }}>
            
        <div className='row'>
            <div className='col-3'>
                <h2 className='mt-2' >my-portfol.io</h2>
            </div>
            <div className='col-5'>
                <h5 className='mt-3' style={{float: 'left'}}>About</h5>
            </div>
            <div className='col-4'>
            <h5 className='mt-3' style={{float: 'left'}}>Contact</h5>
            </div>
        </div>
            
        </footer>
    )
}